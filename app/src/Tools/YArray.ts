/*
 * @Author: Kanata You 
 * @Date: 2020-09-27 09:54:48 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-09-27 09:57:26
 */

export const findOne = <T>(list: Array<T>, filter: (element: T, idx: number) => boolean): T | null => {
    for (let i: number = 0; i < list.length; i++) {
        if (filter(list[i], i)) {
            return list[i];
        }
    }

    return null;
}
