
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

});
