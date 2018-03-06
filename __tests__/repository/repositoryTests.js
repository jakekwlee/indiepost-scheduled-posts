const service = require('../../src/repository/index');

describe('Repository Tests', () => {
  it('castBufferToBoolean(buf: Buffer) should work correctly', () => {
    const buf1 = new Buffer(1);
    const buf2 = new Buffer(1);

    buf1.fill(1);
    buf2.fill(0);
    expect(service.castBufferToBoolean(buf1)).toEqual(true);
    expect(service.castBufferToBoolean(buf2)).toEqual(false);
  });

  describe('getAreFeaturedPostsExist(posts: Array)', function() {
    const cases = [
      [
        { id: 0, title: 'test case0 post0', splash: true, featured: false },
        { id: 1, title: 'test case0 post1', splash: false, featured: false },
      ],
      [
        { id: 0, title: 'test case1 post0', splash: false, featured: false },
        { id: 1, title: 'test case1 post1', splash: false, featured: true },
      ],
      [
        { id: 0, title: 'test case2 post0', splash: false, featured: false },
        { id: 1, title: 'test case2 post1', splash: false, featured: false },
      ],
      [
        { id: 0, title: 'test case3 post0', splash: true, featured: false },
        { id: 1, title: 'test case3 post1', splash: false, featured: true },
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

    for (let i = 0; i < cases.length; ++i) {
      const testCase = cases[i];
      const expectedResult = expected[i];
      it('should return result correctly for test case ' + i, () => {
        const actual = service.getAreFeaturedPostsExist(testCase);
        expect(actual).toEqual(expectedResult);
      });
    }
  });
});
