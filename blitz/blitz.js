(()=>{
    let poses = [];
    let uri = "https://www.posemaniacs.com/";
    let viewer = document.getElementById("viewer");
    let timer = document.getElementById("timer");
    let cloak = document.getElementById("cloak");
    let skip = document.getElementById("skip");
    let counter = 0;

    function init() {
        randomPose()
    }

    function randomPose() {
        counter = -40;
        let pose = poses[Math.floor(Math.random() * poses.length)];
        viewer.src = uri + pose.path + img(Math.floor(1));
    }

    function img(number) {
        const pose = "0000" + number;
        return "pose_" + pose.substring(pose.length - 4, pose.length) + ".jpg";
    }

    setInterval(()=>{
        counter++;
        if (counter < 1) cloak.classList = "t"+(-counter/10|0);
        let value = timer.value;
        if (value < 5) timer.value = value = 5;
        if (counter / 10> value) {
            randomPose();
            counter = -40;
        }
    },100);

    skip.onclick = randomPose;

    $.getJSON('../data.json', function(data) {
        poses = data;
        init();
        $("#loading").remove();
    });
})();
