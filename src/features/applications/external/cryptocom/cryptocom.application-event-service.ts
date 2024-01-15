/**
 * @author : Nicolas Spijkerman
 * @mailto : nicolas.spijkerman@epitech.eu
 * @created : 2024-01-12
 **/

import { ApplicationEventService } from '../../events/decorators/application-event-service.decorator';
import { ApplicationEvent } from '../../events/decorators/application-event.decorator';
import { Inject } from '@nestjs/common';
import { z } from 'zod';
import {
  KEY_VALUE_STORE_PROVIDER,
  KeyValueStore,
} from '../../../../system/keyvaluestore/key-value-store.provider';
import {
  ConnectionCredentialsSchema,
  EventDataSchema,
  TriggerDataSchema,
} from '../../events/ports/event.service';

type KLineDataHistory = {
  instrument_name: string;
  interval: string;
  data: CandleStick[];
};

type CandleStick = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

type BollingerBands = {
  upper: number[];
  middle: number[];
  lower: number[];
};

@ApplicationEventService('crypto.com')
export class CryptoComApplicationEventService {
  constructor(
      @Inject(KEY_VALUE_STORE_PROVIDER)
      private readonly keyValueStore: KeyValueStore,
  ) {}

  @ApplicationEvent('Threshold exceeded')
  async checkIfThresholdExceeded(
      appletId: string,
      eventTriggerData: z.infer<typeof TriggerDataSchema>,
      eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    await this.updateLastPolledAt(appletId);

    const params = {} as any;
    if (eventTriggerData) {
      const { instrument_name, interval, threshold, operation } =
          eventTriggerData;
      params.instrument_name = instrument_name;
      params.interval = interval;
      params.threshold = Number(threshold);
      params.operation = operation;
    }

    const k_line_data_history: KLineDataHistory =
        await this.fetchKLineDataHistory(params.instrument_name, params.interval);

    const currentPrice: CandleStick | undefined =
        k_line_data_history.data.pop();

    if (currentPrice === undefined) {
      return this.formatKLineSynthesis(
          'raw value',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    switch (params.operation) {
      case 'is above':
        if (params.threshold < currentPrice.c) {
          return this.formatKLineSynthesis(
              'raw value',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      case 'is below':
        if (currentPrice.c < params.threshold) {
          return this.formatKLineSynthesis(
              'raw value',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      default:
        throw new Error('Invalid operation');
    }

    return this.formatKLineSynthesis(
        'raw value',
        'idle',
        params.interval,
        params.operation,
        params.threshold,
        params.instrument_name,
        currentPrice,
    );
  }

  @ApplicationEvent('Moving average')
  async checkIfMovingAverageThresholdExceeded(
      appletId: string,
      eventTriggerData: z.infer<typeof TriggerDataSchema>,
      eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    await this.updateLastPolledAt(appletId);

    const params = {} as any;
    if (eventTriggerData) {
      const { instrument_name, interval, period, threshold, operation } =
          eventTriggerData;
      params.instrument_name = instrument_name;
      params.interval = interval;
      params.period = Number(period);
      params.threshold = Number(threshold);
      params.operation = operation;
    }

    const k_line_data_history: KLineDataHistory =
        await this.fetchKLineDataHistory(params.instrument_name, params.interval);

    const currentPrice: CandleStick | undefined =
        k_line_data_history.data.pop();

    if (currentPrice === undefined) {
      return this.formatKLineSynthesis(
          'moving average',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    const movingAverage: number[] = this.calculateMovingAverage(
        k_line_data_history,
        params.period,
    );

    const currentMovingAverage: number = movingAverage.pop() ?? currentPrice.c;

    switch (params.operation) {
      case 'is above':
        if (
            currentMovingAverage < currentPrice.c &&
            params.threshold <= Math.abs(currentPrice.c - currentMovingAverage)
        ) {
          return this.formatKLineSynthesis(
              'moving average',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      case 'is below':
        if (
            currentPrice.c < currentMovingAverage &&
            params.threshold <= Math.abs(currentPrice.c - currentMovingAverage)
        ) {
          return this.formatKLineSynthesis(
              'moving average',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      default:
        throw new Error('Invalid operation');
    }

    return this.formatKLineSynthesis(
        'moving average',
        'idle',
        params.interval,
        params.operation,
        params.threshold,
        params.instrument_name,
        currentPrice,
    );
  }

  @ApplicationEvent('RSI')
  async checkIfRSIThresholdExceeded(
      appletId: string,
      eventTriggerData: z.infer<typeof TriggerDataSchema>,
      eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    await this.updateLastPolledAt(appletId);

    const params = {} as any;
    if (eventTriggerData) {
      const { instrument_name, interval, period, threshold, operation } =
          eventTriggerData;
      params.instrument_name = instrument_name;
      params.interval = interval;
      params.period = Number(period);
      params.threshold = Number(threshold);
      params.operation = operation;
    }

    const k_line_data_history: KLineDataHistory =
        await this.fetchKLineDataHistory(params.instrument_name, params.interval);

    const currentPrice: CandleStick | undefined =
        k_line_data_history.data.pop();

    if (currentPrice === undefined) {
      return this.formatKLineSynthesis(
          'RSI',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    const rsi: number[] = this.calculateRSI(k_line_data_history, params.period);

    const currentRSI: number | undefined = rsi.pop();

    if (currentRSI === undefined) {
      return this.formatKLineSynthesis(
          'RSI',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    switch (params.operation) {
      case 'is above':
        if (currentRSI < params.threshold) {
          return this.formatKLineSynthesis(
              'RSI',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      case 'is below':
        if (params.threshold < currentRSI) {
          return this.formatKLineSynthesis(
              'RSI',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      default:
        throw new Error('Invalid operation');
    }

    return this.formatKLineSynthesis(
        'RSI',
        'idle',
        params.interval,
        params.operation,
        params.threshold,
        params.instrument_name,
        currentPrice,
    );
  }

  @ApplicationEvent('Bollinger bands')
  async checkIfBollingerBandsThresholdExceeded(
      appletId: string,
      eventTriggerData: z.infer<typeof TriggerDataSchema>,
      eventConnectionCredentials?: z.infer<typeof ConnectionCredentialsSchema>,
  ): Promise<z.infer<typeof EventDataSchema>[]> {
    await this.updateLastPolledAt(appletId);

    const params = {} as any;
    if (eventTriggerData) {
      const { instrument_name, interval, period, threshold, operation } =
          eventTriggerData;
      params.instrument_name = instrument_name;
      params.interval = interval;
      params.period = Number(period);
      params.threshold = Number(threshold);
      params.operation = operation;
    }

    const k_line_data_history: KLineDataHistory =
        await this.fetchKLineDataHistory(params.instrument_name, params.interval);

    const currentPrice: CandleStick | undefined =
        k_line_data_history.data.pop();

    if (currentPrice === undefined) {
      return this.formatKLineSynthesis(
          'Bollinger bands',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    const bollingerBands: BollingerBands = this.calculateBollingerBands(
        k_line_data_history,
        params.period,
    );

    const currentUpperBand: number | undefined = bollingerBands.upper.pop();
    const currentMiddleBand: number | undefined = bollingerBands.middle.pop();
    const currentLowerBand: number | undefined = bollingerBands.lower.pop();

    if (
        currentUpperBand === undefined ||
        currentMiddleBand === undefined ||
        currentLowerBand === undefined
    ) {
      return this.formatKLineSynthesis(
          'Bollinger bands',
          'idle',
          params.interval,
          params.operation,
          params.threshold,
          params.instrument_name,
          currentPrice,
      );
    }

    switch (params.operation) {
      case 'is above':
        if (currentUpperBand < currentPrice.c) {
          return this.formatKLineSynthesis(
              'Bollinger bands',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      case 'is below':
        if (currentPrice.c < currentLowerBand) {
          return this.formatKLineSynthesis(
              'Bollinger bands',
              'triggered',
              params.interval,
              params.operation,
              params.threshold,
              params.instrument_name,
              currentPrice,
          );
        }
        break;
      default:
        throw new Error('Invalid operation');
    }

    return this.formatKLineSynthesis(
        'Bollinger bands',
        'idle',
        params.interval,
        params.operation,
        params.threshold,
        params.instrument_name,
        currentPrice,
    );
  }

  private async updateLastPolledAt(appletId: string): Promise<void> {
    let lastPolledAt: string | null = await this.keyValueStore.get(appletId);
    const currentTime: string = new Date().toISOString();

    if (lastPolledAt === null) {
      lastPolledAt = currentTime;
      await this.keyValueStore.set(appletId, currentTime, 60 * 60 * 24);
    } else {
      await this.keyValueStore.set(appletId, currentTime, 60 * 60 * 24);
    }
  }

  private formatKLineSynthesis(
      mode: string,
      status: string,
      interval: string,
      operation: string,
      threshold: number,
      instrument_name: string,
      currentPrice: CandleStick | undefined,
  ): z.infer<typeof EventDataSchema>[] {
    return [
      {
        mode: mode,
        status: status,
        interval: interval,
        operation: operation,
        threshold: threshold.toString(),
        instrument_name: instrument_name,
        currentPrice: currentPrice?.c.toString() ?? 'undefined',
      },
    ];
  }

  private async fetchKLineDataHistory(
      instrument_name: string,
      interval: string,
  ): Promise<KLineDataHistory> {
    const response: Response = await fetch(
        `https://api.crypto.com/v2/public/get-candlestick?instrument_name=${instrument_name}&timeframe=${interval}`,
    );

    if (!response.ok) {
      throw new Error('Could not fetch k-line data history');
    }

    const data: {
      code: number;
      methode: string;
      result: KLineDataHistory;
      message?: string;
    } = await response.json();

    if (data.code !== 0) {
      throw new Error(data.message);
    }

    return data.result;
  }

  private calculateMovingAverage(
      kLineDataHistory: KLineDataHistory,
      period: number,
  ): number[] {
    const data: CandleStick[] = kLineDataHistory.data;

    const movingAverage: number[] = [];

    for (let i: number = 0; i <= data.length - period; i++) {
      let sum: number = 0;

      for (let j: number = i; j < i + period; j++) {
        sum += data[j].c;
      }

      movingAverage.push(sum / period);
    }

    return movingAverage;
  }

  private calculateRSI(
      kLineDataHistory: KLineDataHistory,
      period: number,
  ): number[] {
    const data: CandleStick[] = kLineDataHistory.data;

    const rsi: number[] = [];

    for (let i: number = 1; i < data.length - period; i++) {
      let sumGain: number = 0;
      let sumLoss: number = 0;

      for (let j: number = i; j < i + period; j++) {
        if (j < 0 || data.length <= j) {
          continue;
        }
        if (data[j].c > data[j - 1].c) {
          sumGain += data[j].c - data[j - 1].c;
        } else {
          sumLoss += data[j - 1].c - data[j].c;
        }
      }

      const avgGain: number = sumGain / period;
      const avgLoss: number = sumLoss / period;

      rsi.push(100 - 100 / (1 + avgGain / avgLoss));
    }

    return rsi;
  }

  private calculateBollingerBands(
      kLineDataHistory: KLineDataHistory,
      period: number,
  ): BollingerBands {
    const data: CandleStick[] = kLineDataHistory.data;

    const bollingerBands: BollingerBands = {
      upper: [],
      middle: [],
      lower: [],
    };

    for (let i: number = period - 1; i < data.length; i++) {
      let sum: number = 0;

      for (let j: number = i - period + 1; j <= i; j++) {
        sum += data[j].c;
      }

      const sma: number = sum / period;

      let variance: number = 0;
      for (let j: number = i - period + 1; j <= i; j++) {
        variance += Math.pow(data[j].c - sma, 2);
      }

      const stdDev: number = Math.sqrt(variance / period);

      const upperBand: number = sma + 2 * stdDev;
      const lowerBand: number = sma - 2 * stdDev;

      bollingerBands.upper.push(upperBand);
      bollingerBands.middle.push(sma);
      bollingerBands.lower.push(lowerBand);
    }

    return bollingerBands;
  }
}
