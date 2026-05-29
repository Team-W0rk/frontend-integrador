export interface ContactoCliente {
  id: number;
  tipo: string;
  valor: string;
  etiqueta?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  estado: string;
  contactos?: ContactoCliente[];
  proyectos?: any[];
  creadoEn?: string;
  actualizadoEn?: string;
}