import { TipoContacto } from "./enums.model";

export interface ContactoCliente {
  id?: number;
  tipo: TipoContacto;
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