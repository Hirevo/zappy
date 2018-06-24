import StateMachine from "../StateMachine";

export default interface IState {
    getName: () => string,
    init? : () => void,
    update? : () => void,
    draw? : () => void
}