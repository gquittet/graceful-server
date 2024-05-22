/**
 * Does nothing during the time given.
 * @param n The number of milliseconds to wait
 */
const sleep = (n: number): Promise<void> => new Promise(resolve => setTimeout(resolve, n));

export default sleep;
