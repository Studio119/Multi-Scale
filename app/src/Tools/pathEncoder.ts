/*
 * @Author: Antoine YANG 
 * @Date: 2020-08-21 13:00:58 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-08-21 13:04:12
 */

const encodePath = (path: string) => {
    return path.split("/").join("@0x2F").split(".").join("@0x2E");
};

export const decodePath = (path: string) => {
    return path.split("@0x2F").join("/").split("@0x2E").join(".");
};


export default encodePath;
