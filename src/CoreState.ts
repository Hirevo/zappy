import GUIManager from "./GUIManager"

export default class CoreState {
    private manager: GUIManager;

    public constructor() {
        this.manager = GUIManager.getInstance();
    }

    update() {
        console.log(this.manager.getCamera());
    }
}