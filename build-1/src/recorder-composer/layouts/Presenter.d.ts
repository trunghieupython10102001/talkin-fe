import Media from '../Media';
export default class PresenterLayout implements VideoLayout {
    getBoxes(n: number, size: Size): VideoBox[];
    getBoxesLayout(videos: Media[], size: Size): VideoBox[];
    getScreenBox(size: Size): VideoBox;
    getCamBox(size: Size): VideoBox;
}
