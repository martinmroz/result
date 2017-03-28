
import { expect } from 'chai';
import 'mocha';

import { IResult, Ok, Err } from '../src';

describe('Result', () => {

  it('isOk() returns true for Ok and false for Err', () => {
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));
    expect(ok.isOk()).to.equal(true);
    expect(err.isOk()).to.equal(false);
  });

  it('isErr() returns false for Ok and true for Err', () => {
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));
    expect(ok.isErr()).to.equal(false);
    expect(err.isErr()).to.equal(true);
  });

  it('ok() returns T for Ok and undefined for Err', () => {
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));
    expect(ok.ok()).to.equal(1);
    expect(err.ok()).to.equal(undefined);
  });

  it('err() returns undefined for Ok and E for Err', () => {
    let actualError = new Error('Some error message');
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(actualError);
    expect(ok.err()).to.equal(undefined);
    expect(err.err()).to.equal(actualError);
  });

  it('map() maps IResult<T, E> to IResult<U, E> by applying function', () => {
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));
    const convertToString = (value: number) => {
      return value.toString();
    };

    // Map both an Ok and Err value from T:number to T:string.
    const stringified_ok: IResult<string,Error> = ok.map(convertToString);
    const stringified_err: IResult<string,Error> = err.map(convertToString);

    // Validate the Ok value was mapped, and the error remains untouched.
    expect(stringified_ok.isOk()).to.equal(true);
    expect(stringified_ok.unwrap()).to.equal("1");
    expect(stringified_err.isErr()).to.equal(true);
    expect(stringified_err.ok()).to.equal(undefined);
  });

  it('mapErr() maps IResult<T, E> to IResult<T, F> by applying function', () => {
    const ok: IResult<number,Error> = new Ok<number,Error>(1);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));
    const extractMessage = (error: Error) => {
      return error.message;
    };

    // Map both an Ok and Err value from E:Error to F:string.
    const stringified_ok: IResult<number,string> = ok.mapErr(extractMessage);
    const stringified_err: IResult<number,string> = err.mapErr(extractMessage);

    // Validate the Ok value was mapped, and the error remains untouched.
    expect(stringified_ok.isOk()).to.equal(true);
    expect(stringified_ok.unwrap()).to.equal(1);
    expect(stringified_err.isErr()).to.equal(true);
    expect(stringified_err.err()).to.equal('Some error message');
  });

  it('and() returns argument if receiver is Ok, otherwise receiver', () => {
    const ok_1: IResult<number,Error> = new Ok<number,Error>(1);
    const ok_2: IResult<number,Error> = new Ok<number,Error>(2);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));

    expect(ok_1.and(ok_2)).to.equal(ok_2);
    expect(ok_2.and(ok_1)).to.equal(ok_1);
    expect(err.and(ok_1).isErr()).to.equal(true);
    expect(err.and(ok_2).isErr()).to.equal(true);
  });

  it('andThen() returns result of op() if receiver is Ok, otherwise receiver', () => {
    const ok_1: IResult<number,Error> = new Ok<number,Error>(1);
    const ok_2: IResult<number,Error> = new Ok<number,Error>(2);
    const err: IResult<number,Error> = new Err<number,Error>(new Error('Some error message'));

    expect(ok_1.andThen((value: number) => { return ok_2; })).to.equal(ok_2);
    expect(ok_2.andThen((value: number) => { return ok_1; })).to.equal(ok_1);
    expect(ok_2.andThen((value: number) => { return err; }).isErr()).to.equal(true);
  });

});
