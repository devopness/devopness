import TransactionSpec from './TransactionSpec';

declare module 'hooks' {
    interface Transaction {
        spec: TransactionSpec;
    }
}
