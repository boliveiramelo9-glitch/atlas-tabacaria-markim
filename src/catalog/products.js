// Catálogo inicial intencionalmente vazio. Cadastre apenas informações confirmadas pela loja.
export const products = [];

export function listAvailableProducts() {
  return products.filter((product) => product.active === true && product.available === true);
}

export function findProductById(id) {
  return products.find((product) => product.id === id) ?? null;
}
