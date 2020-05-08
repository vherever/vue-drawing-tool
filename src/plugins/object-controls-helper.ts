export default class ObjectControlsHelper {
  public generateGuid(): string {
    let result;
    result = '';
    for (let j = 0; j < 32; j++) {
      if (j === 8 || j === 12 || j === 16 || j === 20) {
        result += '-';
      }
      const i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result += i;
    }
    return result;
  }
}
