export interface Address {
  cep: '';
  streetName: '';
  neighborhood: '';
  city: '';
  uf: '';
  complement: '';
}

export interface AddressSearch {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
