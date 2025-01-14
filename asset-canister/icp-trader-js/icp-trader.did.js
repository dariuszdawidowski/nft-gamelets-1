const idlFactoryICPTrader = ({ IDL }) => {
const ClaimArgs = IDL.Record({
    'tokenId' : IDL.Text,
    'memo' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const ClaimOk = IDL.Record({ 'orderId' : IDL.Nat });
  const ClaimError = IDL.Variant({
    'TransferClaim' : IDL.Null,
    'OrderNotFound' : IDL.Null,
    'General' : IDL.Null,
    'TransferNotFound' : IDL.Null,
  });
  const ClaimResult = IDL.Variant({ 'ok' : ClaimOk, 'err' : ClaimError });
  const OrderArgs = IDL.Record({ 'tokenId' : IDL.Text, 'amount' : IDL.Nat });
  const OrderOk = IDL.Record({
    'accountId' : IDL.Text,
    'cost' : IDL.Nat,
    'orderId' : IDL.Nat,
  });
  const OrderError = IDL.Variant({
    'TokenNotListed' : IDL.Null,
    'PoolNotEnoughTokens' : IDL.Null,
    'General' : IDL.Null,
    'PoolNotExist' : IDL.Null,
  });
  const OrderResult = IDL.Variant({ 'ok' : OrderOk, 'err' : OrderError });
  return IDL.Service({
    'admin_payoff' : IDL.Func([], [IDL.Nat], []),
    'claim' : IDL.Func([ClaimArgs], [ClaimResult], []),
    'order' : IDL.Func([OrderArgs], [OrderResult], []),
  });
};
