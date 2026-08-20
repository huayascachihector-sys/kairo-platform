import { loadState } from "../../lib/store";

export interface SistemaPuntosConfig {
  puntosPorActividad: {
    shadowing: number;
    grabacion: number;
    roleplay: number;
    juego: number;
  };
  bonusErrorCelebrado: number;
  multiplicadorRacha: number;
  puntosPorHito: number;
}

export const CONFIG_SISTEMA_PUNTOS: SistemaPuntosConfig = {
  puntosPorActividad: {
    shadowing: 5,
    grabacion: 10,
    roleplay: 15,
    juego: 3,
  },
  bonusErrorCelebrado: 25,
  multiplicadorRacha: 1.5,
  puntosPorHito: 50,
};

export class SistemaPuntos {
  private config: SistemaPuntosConfig;
  private historialErrores: string[] = [];
  private rachaActual: number = 0;
  private ultimaActividadDate: Date | null = null;

  constructor(config: SistemaPuntosConfig = CONFIG_SISTEMA_PUNTOS) {
    this.config = config;
  }

  calcularPuntosActividad(tipo: keyof SistemaPuntosConfig['puntosPorActividad']): number {
    const puntosBase = this.config.puntosPorActividad[tipo];
    const multiplicador = this.verificarRacha();
    return Math.round(puntosBase * multiplicador);
  }

  celebrarError(intentosPrevios: number): { puntosBonus: number; mensaje: string } {
    const errorKey = `error-${intentosPrevios}-${Date.now()}`;
    this.historialErrores.push(errorKey);

    const mensajes = [
      '¡Es un error creativo! ¡Te das un apuro por intentarlo!',
      '¡Eso fue valiente! Los errores son pasos hacia el éxito!',
      '¡Perfecto! Tu cerebro está construyendo nuevas rutas neuronales!',
      '¡Increíble esfuerzo! Ese error te acerca más al éxito!',
    ];

    return {
      puntosBonus: this.config.bonusErrorCelebrado,
      mensaje: mensajes[Math.floor(Math.random() * mensajes.length)],
    };
  }

  registrarActividad(): void {
    const now = new Date();
    if (this.ultimaActividadDate) {
      const diffHours = (now.getTime() - this.ultimaActividadDate.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        this.rachaActual++;
      } else {
        this.rachaActual = 1;
      }
    } else {
      this.rachaActual = 1;
    }
    this.ultimaActividadDate = now;
  }

  private verificarRacha(): number {
    if (this.rachaActual >= 7) return this.config.multiplicadorRacha;
    return 1;
  }

  getRachaMensaje(): string {
    if (this.rachaActual >= 7) return '¡Racha épica! ¡Doble puntos!';
    if (this.rachaActual >= 3) return '¡Buena racha! Sigue así!';
    return '';
  }

  getPuntosTotales(): number {
    const state = loadState();
    return state.xp + state.gems * 10;
  }
}