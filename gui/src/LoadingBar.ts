export default class LoadingBar {
    private progressB : HTMLElementTagNameMap["div"];
    private progressW : HTMLElementTagNameMap["div"];

    constructor() {
        this.progressW = document.createElement('div');
        this.progressB = document.createElement('div');
        this.progressB.classList.add("progress-bar");
        this.progressW.classList.add("progress-wrap");
        this.progressW.appendChild(this.progressB);
    }

    public show() {
        document.body.appendChild(this.progressW);
    }

    public hide() {
        this.progressW.remove();
    }

    public setPercentage(percent: number) {
        if (percent > 100)
            percent = 100;
        if (percent < 0)
            percent = 0;
        this.progressB.style.width = percent + "%";
    }

    public incPercentage(percent: number) {
        let current;
        if (this.progressB.style.width)
            current = parseInt(this.progressB.style.width);
        else
            current = 0;
        current += percent;
        this.setPercentage(current);
    }

    public setError(text: string) {
        this.progressB.style.backgroundColor = "tomato";
        this.progressW.style.backgroundColor = "tomato";
        this.progressW.textContent = text;
    }
}