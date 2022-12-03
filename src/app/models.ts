export interface Producto {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    id: string;
    fecha: Date;
}

export interface Cliente {
    uid: string;
    nombre: string;
    email: string;
    celular: string;
    password: string;
    imagenperfil: string;
    referencia: string;
    ubicacion: any;
}