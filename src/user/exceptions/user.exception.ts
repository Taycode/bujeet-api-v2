export class IncorrectCredentialsException extends Error {
  constructor() {
    super('The credentials inputted are incorrect');
    this.name = 'IncorrectCredentialsException';
  }
}
