import GUIManager from "./GUIManager"
import SockerCom from "./SocketCom"
import StateMachine from "./StateMachine";
import StateShare from "./States/StateShare";
import InitState from "./States/InitState";
import AssetsPool from "./AssetsPool";

function animate() {
    requestAnimationFrame(animate);
    GUIManager.getInstance().getRenderer().render(GUIManager.getInstance().getScene(), GUIManager.getInstance().getCamera());
}

function main() {
    // let sock = new SocketCom(33333);
    let manager = GUIManager.getInstance();
    let assetsPool = new AssetsPool();
    let stateShare = new StateShare();
    let stateMachine = new StateMachine(stateShare);
    stateShare.addKey("stateMachine", stateMachine);
    stateShare.addKey("assetsPool", assetsPool);

    stateMachine.push(new InitState(stateShare));
    // assetsPool.loadAssets("map", "models/map/map.obj", "models/map/map.mtl", (evt) => {
    //     console.log((evt.loaded / evt.total) * 100);
    // }, (obj) => {
    //     manager.getScene().add(obj);
    //     requestAnimationFrame(animate);
    // });
    // stateMachine.push(new InitState(stateShare));

    // stateMachine.push(new CoreState());
}

main();