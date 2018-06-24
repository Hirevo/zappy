import * as THREE from "three"
import StateShare from "../States/StateShare"
import GUIManagger from "../GUIManager"
import {Vector2, Vector3} from "three";
import {IEgg, IEntitiesResp, IIncantation, IPlayerEntity, ITileResp} from "../ICom";
import MapEntity from "../Entity/MapEntity";

export default class MainScene {
    private map: MapEntity;
    private state: StateShare;
    private manager: GUIManagger;

    constructor(state: StateShare) {
        this.state = state;
        this.map = new MapEntity(this.state.getAssetsPool(), this.state.getMapSize());
        this.manager = GUIManagger.getInstance();
    }

    private setCamera() {
        let camera = this.manager.getCamera();

        camera.position.x = 10;
        camera.position.y = 20;
        camera.position.z = 30;
        camera.lookAt(10, 0, 50);
    }

    private setLight() {
        let intensity = 0.7;
        let light;
        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(0, 1, 0);
        light.lookAt(0, 0, 0);
        GUIManagger.getInstance().getScene().add(light);

        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(1, 1, 1);
        light.lookAt(0, 0, 0);
        GUIManagger.getInstance().getScene().add(light);

        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(-1, 1, -1);
        light.lookAt(0, 0, 0);
        GUIManagger.getInstance().getScene().add(light);

        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(0, 1, 0);
        light.lookAt(0, 20, 0);
        GUIManagger.getInstance().getScene().add(light);

        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(1, 1, 1);
        light.lookAt(0, 20, 0);
        GUIManagger.getInstance().getScene().add(light);

        light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(-1, 1, -1);
        light.lookAt(0, 20, 0);
        GUIManagger.getInstance().getScene().add(light);
    }

    private generateSkyBox() {
        let reflectionCube = this.state.getAssetsPool().getCubeTexture("skybox");

        reflectionCube.format = THREE.RGBFormat;
        let shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = reflectionCube;
        let material = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
        this.manager.getScene().add(mesh);
    }

    public update() {
        this.map.update();
    }

    public generate() {
        this.setCamera();
        this.setLight();
        this.generateSkyBox();
    }

    public initMapTile(resp: IEntitiesResp) {
        resp.data.forEach((elem) => {
            this.map.initEntitiesTile(elem);
        });
    }

    public setTile(data: ITileResp) {
        let pos = new Vector2(data.pos.x, data.pos.y);
        let mapSize = new Vector2(this.state.getMapSize().x, this.state.getMapSize().y);
        let ratio = new Vector2(this.map.getPosEnd().x - this.map.getPosStart().x, this.map.getPosEnd().y - this.map.getPosStart().y);
        let scale = new Vector2(ratio.x / mapSize.x, ratio.y / mapSize.y);

        this.map.setTile(data,
            new Vector2(pos.x * scale.x + this.map.getPosStart().x, pos.y * scale.y + this.map.getPosStart().y),
            new Vector2((pos.x + 1) * scale.x + this.map.getPosStart().x, (pos.y + 1) * scale.y + this.map.getPosStart().y)
        );
    }

    // EVENT
    public playerJoin(data: any) {
        data = (data as IPlayerEntity);
        this.map.playerJoin(data);
    }

    public playerDeath(data: any) {
        data = (data as IPlayerEntity);
        this.map.playerDeath(data);
    }

    public playerMove(data: any) {
        data = (data as IPlayerEntity);
        this.map.playerMove(data);
    }

    public playerTurn(data: any) {
        data = (data as IPlayerEntity);
        this.map.playerTurn(data);
    }

    public playerIncantationStart(data: any) {
        data = (data as IIncantation);
        this.map.playerIncantationStart(data);
    }

    public playerIncantationFail(data: any) {
        data = (data as IIncantation);
        this.map.playerIncantationFail(data);
    }

    public playerIncantationSuccess(data: any) {
        data = (data as IIncantation);
        this.map.playerIncantationSuccess(data);
    }

    public playerDropEgg(data: any) {
        data = (data as IEgg);
        this.map.playerDropEgg(data);
    }

    public playerHatchEgg(data: any) {
        data = (data as IEgg);
        this.map.playerHatchEgg(data);
    }
}