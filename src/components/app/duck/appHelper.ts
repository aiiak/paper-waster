import { KawaiiMood } from 'react-kawaii';

module appHelper {
    type moodItem = { left: number; mood: KawaiiMood };
    const moodRanges: moodItem[] = [
        { left: 0, mood: 'excited' },
        { left: 20, mood: 'lovestruck' },
        { left: 40, mood: 'blissful' },
        { left: 80, mood: 'happy' },
        { left: 120, mood: 'sad' },
        { left: 200, mood: 'shocked' }
    ];

    export function getMood(cellLeft: number): KawaiiMood {
        return moodRanges.find(item => item.left > cellLeft)?.mood || 'shocked';
    }
}
export default appHelper;
