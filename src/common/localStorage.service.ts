export const getItem = (itemName: string): any => {
    const item = window.localStorage.getItem(itemName);
    return item ? JSON.parse(item) : null;
};

export const saveItem = (itemName: string, item: any): void => {
    window.localStorage.setItem(itemName, JSON.stringify(item));
};

export const destroyItem = (itemName: string): void => {
    window.localStorage.removeItem(itemName);
};

export default { getItem, saveItem, destroyItem };