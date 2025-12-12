import { ConsoleLogger, LogLevel, Logger } from '@nestjs/common'; // bazowy logger Nest
import { createWriteStream, existsSync, mkdirSync } from 'fs'; // operacje plikowe
import { join } from 'path'; // budowanie sciezek

export class FileLogger extends ConsoleLogger {
  private static stream = FileLogger.createStream(); // strumien pliku logow

  static setLogLevels(levels: LogLevel[]) {
    Logger.overrideLogger(levels); // zmien poziomy logowania globalnie
  }

  private static createStream() {
    const logsDir = join(process.cwd(), 'logs'); // katalog logow
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true }); // utworz katalog jezeli nie ma
    }
    return createWriteStream(join(logsDir, 'app.log'), { flags: 'a' }); // dopisuj do pliku
  }

  private write(level: string, message: any, context?: string, trace?: string) {
    const ts = new Date().toISOString(); // timestamp
    const ctx = context ?? this.context; // kontekst
    const msg = typeof message === 'string' ? message : JSON.stringify(message); // tekst logu
    const line = `[${ts}] [${level}]${ctx ? ` [${ctx}]` : ''} ${msg}${trace ? `\n${trace}` : ''}\n`; // format wpisu
    FileLogger.stream.write(line); // zapisz do pliku
  }

  log(message: any, context?: string) {
    super.log(message, context); // loguj na konsoli
    this.write('LOG', message, context); // i do pliku
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context); // konsola
    this.write('ERROR', message, context, trace); // plik
  }

  warn(message: any, context?: string) {
    super.warn(message, context); // konsola
    this.write('WARN', message, context); // plik
  }

  debug(message: any, context?: string) {
    super.debug?.(message, context); // konsola debug (jesli wlaczony)
    this.write('DEBUG', message, context); // plik
  }

  verbose(message: any, context?: string) {
    super.verbose?.(message, context); // konsola verbose
    this.write('VERBOSE', message, context); // plik
  }
}
