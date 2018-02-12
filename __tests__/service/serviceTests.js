const service = require('../../src/service');

describe('Service Unit Tests', () => {
  it('castBufferToBoolean(buf: Buffer) should work correctly', () => {
    const buf1 = new Buffer(1);
    const buf2 = new Buffer(1);
    buf1[0] = 0x01;
    buf2[1] = 0x00;
    expect(service.castBufferToBoolean(buf1)).toEqual(true);
    expect(service.castBufferToBoolean(buf2)).toEqual(false);
  });

  it('getAreFeaturedPostsExist(posts: Array) should return result correctly', () => {
    const cases = [
      [
        { id: 0, title: 'test case0 post0', splash: true, feature: false },
        { id: 1, title: 'test case0 post1', splash: false, feature: false },
      ],
      [
        { id: 0, title: 'test case1 post0', splash: false, feature: false },
        { id: 1, title: 'test case1 post1', splash: false, feature: true },
      ],
      [
        { id: 0, title: 'test case2 post0', splash: false, feature: false },
        { id: 1, title: 'test case2 post1', splash: false, feature: false },
      ],
      [
        { id: 0, title: 'test case3 post0', splash: true, feature: false },
        { id: 1, title: 'test case3 post1', splash: false, feature: true },
      ],
    ];

    const expected = [
      {
        splash: true,
        featured: false,
      },
      {
        splash: false,
        featured: true,
      },
      {
        splash: false,
        featured: false,
      },
      {
        splash: true,
        featured: true,
      },
    ];

    const actual = cases.map(postsCase =>
      service.getAreFeaturedPostsExist(postsCase)
    );
    expect(actual).toEqual(expected);
  });
});
