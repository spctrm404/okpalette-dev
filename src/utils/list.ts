type WithUuid<T> = Omit<T, 'uuid'> & { uuid: string };

export const injectUuid = <T extends { uuid?: unknown }>(
  list: T[]
): WithUuid<T>[] => {
  return list.map((item) => ({
    ...item,
    uuid: typeof item.uuid === 'string' ? item.uuid : crypto.randomUUID(),
  }));
};
