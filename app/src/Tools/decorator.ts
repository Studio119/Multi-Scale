/*
 * @Author: Antoine YANG 
 * @Date: 2020-08-31 01:55:36 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-08-31 02:27:02
 */

/**
 * 获取一个函数的防抖引用.
 *
 * @template RT 原函数返回值
 * @param {(...args: Array<any>) => RT} f 原函数
 * @param {number} [span=200] 无效化间隔
 * @returns {(() => RT | null)}
 */
export const debounced = <RT>(
    f: (...args: Array<any>) => RT, span: number = 200
): () => RT | null => {
    let flag: boolean = true;

    return function () {
        if (flag) {
            flag = false;
            setTimeout(() => {
                flag = true;
            }, span);
            return f.apply({}, arguments as any);
        }
        return null;
    };
};

/**
 * 获取一个函数的防抖异步引用，
 * 当这个函数被连续触发时，只有最后一次生效.
 *
 * @template RT 原函数返回值
 * @param {() => RT} f 原函数
 * @param {number} [span=200] 无效化间隔
 * @returns {Promise<() => Promise<RT | null>>}
 */
export const lastCalled = async <RT>(
    f: () => RT, span: number = 200
): Promise<() => Promise<RT | null>> => {
    let curId: number = 0;

    return async () => {
        curId = (curId + 1) % 1e6;
        const id: number = curId;
        const p: Promise<RT | null> = new Promise<RT | null>((resolve, reject) => {
            setTimeout(() => {
                if (id !== curId) {
                    resolve(null);
                }
                try {
                    resolve(f());
                } catch (e) {
                    reject(e);
                }
            }, span);
        });
        return await p;
    };
};
