import { FromNowPipe } from './from-now.pipe';

describe('FromNowPipe', () => {

  it('should transform the input', () => {
    // given a pipe
    const pipe = new FromNowPipe();

    // when transforming the date
    const date = '2016-02-18T08:02:00Z';
    const transformed = pipe.transform(date);

    // then we should have a formatted string
    expect(transformed).toContain('ago',
      'The pipe should transform the date into a human string, using the `fromNow` method of Moment.js');
  });
});
