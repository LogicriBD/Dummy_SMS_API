import { Signal } from '../../types/Signals';

export const SignalActions: Signal[] = [
  { code: 'SIGINT', message: 'Interrupt signal (Ctrl+C)', action: 'shutdown' },
  { code: 'SIGTERM', message: 'Termination signal', action: 'shutdown' },
  { code: 'SIGUSR2', message: 'User-defined signal 2', action: 'log' },
  { code: 'SIGBREAK', message: 'Break signal (Ctrl+Break on Windows)', action: 'shutdown' },
  { code: 'SIGHUP', message: 'Hangup detected, often used for config reloads', action: 'shutdown' },
  { code: 'SIGQUIT', message: 'Quit and generate core dump', action: 'log' },
  { code: 'SIGABRT', message: 'Abort signal, usually triggered by abort()', action: 'log' },
  { code: 'SIGFPE', message: 'Floating-point exception', action: 'log' },
  { code: 'SIGILL', message: 'Illegal instruction', action: 'log' },
  { code: 'SIGSEGV', message: 'Segmentation fault', action: 'log' },
  { code: 'SIGTRAP', message: 'Trace/breakpoint trap', action: 'log' },
  { code: 'SIGSYS', message: 'Bad system call', action: 'log' },
  { code: 'SIGXCPU', message: 'CPU time limit exceeded', action: 'shutdown' },
  { code: 'SIGXFSZ', message: 'File size limit exceeded', action: 'log' },
  { code: 'SIGALRM', message: 'Alarm clock signal', action: 'log' },
  { code: 'SIGPIPE', message: 'Broken pipe: write to pipe with no readers', action: 'ignore' },
  { code: 'SIGCHLD', message: 'Child process status changed', action: 'ignore' },
  { code: 'SIGCONT', message: 'Continue if stopped', action: 'ignore' },
  { code: 'SIGTTIN', message: 'Background process tried to read terminal input', action: 'ignore' },
  { code: 'SIGTTOU', message: 'Background process tried to write to terminal', action: 'ignore' },
  { code: 'SIGPOLL', message: 'Pollable event', action: 'log' },
  { code: 'SIGPROF', message: 'Profiling timer expired', action: 'log' },
  { code: 'SIGPWR', message: 'Power failure signal', action: 'shutdown' },
  { code: 'SIGSTKFLT', message: 'Stack fault (Linux-specific)', action: 'log' },
  { code: 'SIGURG', message: 'Urgent condition on socket', action: 'log' },
  { code: 'SIGVTALRM', message: 'Virtual timer expired', action: 'log' },
  { code: 'SIGWINCH', message: 'Window size change', action: 'ignore' },
];
