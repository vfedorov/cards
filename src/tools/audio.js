import { Howl } from 'howler';

export default function audio() {
    async function playAudioDraw() {
        var sound = new Howl({
            src: ['/audio/draw.ogg']
        });
        sound.play();
    }
    async function playAudioError() {
        var sound = new Howl({
            src: ['/audio/error.ogg']
        });
        sound.play();
    }
    async function playAudioFinal() {
        var sound = new Howl({
            src: ['/audio/final.ogg']
        });
        sound.play();
    }
    return { playAudioDraw, playAudioError, playAudioFinal };
}