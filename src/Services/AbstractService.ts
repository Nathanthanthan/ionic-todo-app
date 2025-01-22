type AbstractService<T> = {
  create: (object: Partial<T>) => Promise<boolean>;
  update: (id: string, updatedValues: Partial<T>) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
};

export default AbstractService;
