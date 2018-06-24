import * as THREE from "three";
import IState from "./States/IState"
import StateShare from "./States/StateShare";
import GUIManager from "./GUIManager";

function animate() {
    let manager = GUIManager.getInstance();

    let delta = manager.getClock().getDelta();
    let mixers = manager.getMixers();
    mixers.forEach((mixer) => {
        mixer.update(delta);
    })

    requestAnimationFrame(animate);

    manager.getRenderer().clear();
    manager.getRenderer().render(manager.getScene(), manager.getCamera());
}

export default class StateMachine {
    private states : Array<IState>;
    private share: StateShare;

    constructor(stateShare: StateShare) {
        this.states = [];
        this.share = stateShare;

        requestAnimationFrame(animate);

        setInterval(() => {
            this.update();
        }, 10);
    }

    public push(state: IState) : StateMachine {
        if ((<any> state.init))
            (<any> state.init)();
        this.states.push(state);
        return this;
    }

    public pop() : StateMachine {
        this.states.pop();
        return this;
    }

    // private animate() {
    //     let manager = GUIManager.getInstance();
    //
    //     requestAnimationFrame(this.animate);
    //     manager.getRenderer().render(manager.getScene(), manager.getCamera());
    // }

    public  isLoaded(name: string) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].getName() === name) {
                return true;
            }
        }
        return false;
    }

    public update() : void {
        if (this.states.length != 0) {
            (<any> this.states[this.states.length - 1].update)();
        }
    }
}