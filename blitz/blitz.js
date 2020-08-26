(()=>{
    let poses = [];
    let uri = "https://www.posemaniacs.com/";
    let viewer = document.getElementById("viewer");
    let timer = document.getElementById("timer");
    let cloak = document.getElementById("cloak");
    let skip = document.getElementById("skip");

    // settings
    let btn10 = document.getElementById("btn10");
    let btn15 = document.getElementById("btn15");
    let btn30 = document.getElementById("btn30");
    let btn40 = document.getElementById("btn40");
    let btn60 = document.getElementById("btn60");
    let btn90 = document.getElementById("btn90");
    let btncd = document.getElementById("btncountdown");
    let btnStart = document.getElementById("btnStart");

    let counter = 0;
    let pause = true;
    let countdown = true;

    function randomPose() {
        counter = countdown?-40:0;
        let pose = poses[Math.floor(Math.random() * poses.length)];
        viewer.src = uri + pose.path + img(Math.floor(1));
    }

    function img(number) {
        const pose = "0000" + number;
        return "pose_" + pose.substring(pose.length - 4, pose.length) + ".jpg";
    }

    setInterval(()=>{
        if (pause) return;
        counter++;
        if (counter < 1) cloak.classList = "t"+(-counter/10|0);
        let value = timer.value;
        if (value < 5) timer.value = value = 5;
        if (counter / 10> value) {
            randomPose();
            counter = countdown?-40:0;
        }
    },100);

    skip.onclick = randomPose;

    function clearsecbtn() {
        for (const e of document.getElementsByClassName("secbtn"))
            e.classList.remove("selected");
    }
    btn10.onclick = () => {timer.value = 10;clearsecbtn(); btn10.classList.add("selected")};
    btn15.onclick = () => {timer.value = 15;clearsecbtn(); btn15.classList.add("selected")};
    btn30.onclick = () => {timer.value = 30;clearsecbtn(); btn30.classList.add("selected")};
    btn40.onclick = () => {timer.value = 40;clearsecbtn(); btn40.classList.add("selected")};
    btn60.onclick = () => {timer.value = 60;clearsecbtn(); btn60.classList.add("selected")};
    btn90.onclick = () => {timer.value = 90;clearsecbtn(); btn90.classList.add("selected")};

    btncd.onclick = () => {countdown=!countdown; btncd.innerText = countdown?"On":"Off"};

    btnStart.onclick = () => {
        pause = false;
        document.getElementById("main-viewer").classList.remove("hidden");
        document.getElementById("settings").classList.add("hidden");
        randomPose();
    }

    $.getJSON('../data.json', function(data) {
        poses = data;
        $("#loading").remove();
    });
})();
