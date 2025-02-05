export type Signal = {
  code:
    | 'SIGINT'
    | 'SIGTERM'
    | 'SIGUSR2'
    | 'SIGBREAK'
    | 'SIGHUP'
    | 'SIGQUIT'
    | 'SIGABRT'
    | 'SIGFPE'
    | 'SIGILL'
    | 'SIGSEGV'
    | 'SIGTRAP'
    | 'SIGSYS'
    | 'SIGXCPU'
    | 'SIGXFSZ'
    | 'SIGALRM'
    | 'SIGPIPE'
    | 'SIGCHLD'
    | 'SIGCONT'
    | 'SIGTTIN'
    | 'SIGTTOU'
    | 'SIGPOLL'
    | 'SIGPROF'
    | 'SIGPWR'
    | 'SIGSTKFLT'
    | 'SIGURG'
    | 'SIGVTALRM'
    | 'SIGWINCH';
  message: string;
  action: 'shutdown' | 'log' | 'ignore';
};
