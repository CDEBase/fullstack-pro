export const persons = [
  {
    id: '1',
    sex: 'male',
    name: 'miro',
  },
  {
    id: '2',
    sex: 'female',
    name: 'lala',
  },
  {
    id: '3',
    sex: 'male',
    name: 'joe',
  },
];

export const findPerson = (personRepo: Array<any>, id: string) => {
  return personRepo.find(person => person.id === id);
};

export const addPerson = (personRepo: Array<any>, person: any) => {
  personRepo.push(person);
  return person;
};
