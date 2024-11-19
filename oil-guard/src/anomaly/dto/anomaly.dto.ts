export namespace AnomalyDto {
  export class Output {
    id: number;
    pipelineName: string;
    severity: string;
    predictionModel: string;
    status: string;
    detectAt: string;
  }
}
