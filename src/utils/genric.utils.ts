class GenericUtils {
  static formatString = (message: string, ...parameters: any[]): string => {
    const placeholdersCount = message.split("{}").length - 1;
    if (placeholdersCount !== parameters.length) {
      throw new Error(`Number of placeholders and parameters don't match.`);
    }

    let index = 0;
    return message.replace(/{}/g, () => String(parameters[index++]));
  };
}

export default GenericUtils;
