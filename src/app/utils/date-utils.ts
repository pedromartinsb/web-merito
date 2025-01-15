export class DateUtils {
  /**
   * Retorna a data atual no formato do horário de Brasília.
   */
  static getCurrentDateInBrasilia(): Date {
    const now = new Date();
    return new Date(now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
  }

  /**
   * Formata uma data para o padrão brasileiro (dd/MM/yyyy HH:mm:ss).
   */
  static formatToBrazilianDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
    }).format(date);
  }

  /**
   * Calcula a diferença entre duas datas em dias.
   */
  static getDifferenceInDays(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Adiciona dias a uma data.
   */
  static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Verifica se uma data é um final de semana.
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo = 0, Sábado = 6
  }
}
