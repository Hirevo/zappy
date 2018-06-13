import GUIManager from "./GUIManager"
import CoreState from "./CoreState"
import SockerCom from "./SocketCom"

function main() {
    let sock = new SockerCom(33333);
    let manager = GUIManager.getInstance();
    let core = new CoreState();

    console.log(manager.getCamera());
    core.update();
    setTimeout(() => {
        sock.send("test");
        console.log('send');
    }, 1000);
}

main();