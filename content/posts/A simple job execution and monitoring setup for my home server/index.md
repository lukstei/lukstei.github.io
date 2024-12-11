---
title: A simple job execution and monitoring setup for my home server
tags: ["selfhosting", "programming"]
author: Lukas Steinbrecher
date: 2024-08-12
---


## The quest for simplicity

For some time now, I've been looking for a lightweight solution to handle periodic tasks on servers. These tasks range from backups and system maintenance to application-specific jobs. Here's what I need:
- Run scripts periodically
- Monitor job status (working/failing, last execution time)
- Output Prometheus-compatible metrics for Grafana integration
- Allow custom job metrics, such as backup size for a backup job
- A secure way to pass sensitive information to scripts (nice to have)

## Previous attempts

I tried several approaches before settling on my current solution:
- **Plain Cron**: Simple but limited monitoring capabilities, monitoring successes and failures was cumbersome.
- **[Windmill](https://windmill.dev/)**: While it worked well and covered all my needs, it felt too heavy for my needs. Especially when I thought about running this service on every server in my network.
- **[Ofelia](https://github.com/mcuadros/ofelia)**, which is a docker-based cron manager. I tried it because it is docker based and you can define jobs via docker labels which suits my use case because I run all services in docker. However, it only worked for basic jobs and was too limited in the end.

## My solution

I ended up creating a two component system:

### 1. Job wrapper script

A simple Python script (`job-wrapper.py`) that

- Runs each job with given parameters.
- Measures execution time and success status.
- Writes metrics to a specified folder, and handles the basic state management required (e.g., to remember the timestamp when each job was successfully executed).
- Provides an environment variable for jobs to print custom metrics.
- Has no external dependencies and can be run in a vanilla Linux environment.

### 2. Scheduling with built-in services

I chose `systemd` over cron because it also gives you logging for free, since I already collect the journal output to my Loki instance.

Here's how to run a job (inside a systemd unit):

```bash
/usr/bin/env python3 /apps/services/job-wrapper/job-wrapper.py backup-photos \
  /apps/services/job-backup/backup.sh /media/data/photos
```

The job is also given a name (the first parameter to `job-wrapper.py'), which is used for writing the metric files and as metric labels.

## Visualization and alerting

I use `alloy` to collect the metric files from the output folder using the [Unix exporter](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.exporter.unix/). Each job produces one or more metric files.

The cool thing is that once the Grafana dashboard is up and running, all the jobs you define are automatically picked up and displayed.

Everything shows up in Grafana. Here's what I'm monitoring:
- Time since last successful execution, also with alerts in case important jobs are not running for a certain period of time.
- Success status of the last run.
- Execution time, to make sure jobs don't hang or become inefficient.

![Grafana](grafana.png)

### How custom metrics work

The job wrapper passes a `JOB_METRICS_FILE` environment variable to the job where custom metrics can be written.

For my backup jobs using Borg (a deduplicating backup program), I output the backup size, which is then automatically collected and can be visualized in Grafana:

```bash
cat > $JOB_METRICS_FILE << EOF
# HELP job_backup_size_bytes Size of the backup in bytes
# TYPE job_backup_size_bytes gauge
job_backup_size_bytes{borg_repo="$BORG_REPO"} $BACKUP_SIZE
EOF
```

### Server health check

If the server is completely down, I don't get any alerts from Grafana. So I use another job that does a curl to `healthchecks.io` every 30 minutes. I'll get an alert from healthchecks.io if there is a missed check.

## Conclusion

This setup suits my needs because it

- Uses existing system components (systemd and Python), making it lightweight and simple.
- Provides reliable job execution and monitoring.
- New jobs automatically show up in Grafana.
- If I need additional features, all I have to do is modify the job wrapper script.

The only thing missing is a proper secrets management solution. I'm considering using systemd credentials (https://systemd.io/CREDENTIALS/) for this purpose, please let me know if you have a better idea.

Check out the job-wrapper script on [GitHub](https://github.com/lukstei/job-wrapper).
