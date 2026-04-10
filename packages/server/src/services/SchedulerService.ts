import schedule, { Job, JobCallback } from 'node-schedule';

export class SchedulerService {
  private scheduledJobs: Map<string, Job> = new Map();

  private static instance: SchedulerService;
  private constructor() {}
  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  public scheduleJob(name: string, cronExpression: string, jobFunction: JobCallback): void {
    const existingJob = this.scheduledJobs.get(name);
    if (existingJob) {
      existingJob.cancel();
    }
    const job = schedule.scheduleJob(cronExpression, jobFunction);
    this.scheduledJobs.set(name, job);
  }
}
