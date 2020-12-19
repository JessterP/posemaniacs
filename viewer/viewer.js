(()=>{
    let poses = [];
    let currentPose = {};
    let uri = "https://www.posemaniacs.com/";
    let viewer = document.getElementById("viewer");
    let tagList = document.getElementById("activetags");
    let openOriginal = document.getElementById("open-original");
    let search = document.getElementById("search");
    let tagsNode = document.getElementById("tags");
    let loadAllButton = document.getElementById("load_more");
    let thumbs = [];
    let tags = {};
    let filter = [];
    let deg = 0;
    let index = 1;
    let animation = false;
    let skip = 0;

    function setDeg(number) {
        animation = false;
        deg = number;
        updateDeg();
    }

    function updateDeg() {
        while (deg < 0) deg += 36;
        index = Math.abs((deg | 0) % 36);
        if (index === 0) index = 36;
        updateViewer();
    }

    function init() {
        currentPose = poses[0];
        if (window.location.hash) {
            const id = parseInt(window.location.hash.substr(1));
            if (!isNaN(id)) {
                for (let pose of poses) {
                    if (pose.id === id) {
                        currentPose = pose;
                        break;
                    }
                }
            }
        }
        updateSearch();
        var thumbContainer = document.getElementById("viewer-thumb");
        for (let i = 0; i < 36; i++) {
            const img = document.createElement("img");
            img.classList.add("thumb");
            img.setAttribute('draggable', false);
            let x = i + 1;
            img.onclick = () => setDeg(x);
            thumbContainer.appendChild(img);
            thumbs.push(img);
        }
        for (let pose of poses)
            for (let tag of pose.tags)
                if (tags[tag]) tags[tag]++;
                else tags[tag] = 1;
        for (let [tag,count] of Object.entries(tags)) {
            let div = document.createElement("div");
            div.innerText = tag + " ("+count+")";
            div.dataset.tag = tag;
            div.onclick = () => {
                if (filter.indexOf(tag) === -1) {
                    filter.push(tag);
                } else {
                    filter = filter.filter(function(e) { return e !== tag })
                }
                updateSearch();
            };
            tagsNode.appendChild(div);
        }
        fullUpdate();
    }

    function updateViewer() {
        viewer.src = uri + currentPose.path + img(index);
    }

    function fullUpdate() {
        animation = true;
        viewer.setAttribute('draggable', false);
        index = 1;
        updateViewer();
        for (var i = 1; i <= 36; i++) {
            thumbs[i-1].src = uri + currentPose.path + img(i);
        }
        tagList.innerHTML = '';
        for (let tag of currentPose.tags) {
            var div = document.createElement("div");
            div.innerText = tag;
            div.onclick = () => {
                filter = [tag];
                updateSearch();
            };
            tagList.appendChild(div);
        }
        openOriginal.href = uri+"archive/"+currentPose.id;
        window.location.hash = currentPose.id;
    }

    function updateSearch(all = false) {
        loadAllButton.disabled = true;
        var s = skip;
        search.innerHTML = '';
        for (let tag of tagsNode.children) {
            if (filter.indexOf(tag.dataset.tag) === -1)
                tag.classList.remove("active");
            else tag.classList.add("active");
        }

        for (let pose of poses) {
            if (!passesFilter(pose)) continue;
            if (s-- > 0) continue;
            if (s < -100 && !all) {
                loadAllButton.disabled = false;
                break;
            }
            let img = document.createElement("img");
            img.src = uri + pose.path + "pose_0001_thumb.jpg";
            img.classList.add("thumb2")
            img.setAttribute('draggable', false);
            img.onclick = () => {
                currentPose = pose;
                fullUpdate();
            };
            search.appendChild(img);
        }
    }

    function passesFilter(pose) {
        if (filter.length === 0) return true;
        if (pose.tags.length < filter.length) return false;
        for (let tag of filter)
            if (pose.tags.indexOf(tag) === -1)
                return false;
        return true;
    }

    function img(number) {
        const pose = "0000" + number;
        return "pose_" + pose.substring(pose.length - 4, pose.length) + ".jpg";
    }

    let down = false;
    let lastX = 0;
    viewer.onmousedown = ev => {
        animation = false;
        ev.preventDefault();
        down = true;
        lastX = ev.clientX
    };
    document.onmouseup = ev => {
        ev.preventDefault();
        down = false;
    };
    document.onmousemove = ev => {
        if (down) {
            ev.preventDefault();
            let dif = lastX - ev.clientX;
            lastX = ev.clientX;
            deg += 0.04 * dif;
            updateDeg();
        }
    };
    viewer.onwheel = ev => {
        animation = false;
        ev.preventDefault();
        deg += ev.deltaY * -0.01;
        updateDeg();
    };

    loadAllButton.onclick = e => {
        updateSearch(true);
    }

    setInterval(()=>{
        if (animation) {
            if (deg++ > 36) deg = 1;
            updateDeg()
        }
    },70);

    $.getJSON('../data.json', function(data) {
        poses = data;
        init();
        $("#loading").remove();
    });
})();
