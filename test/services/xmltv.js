const {
    getSeasonNumber,
    getEpisodeNumber,
} = require('../../app/services/xmltv');

/* Some examples will make things clearer.  The first episode of the
second series is '1.0.0/1' .  If it were a two-part episode, then the
first half would be '1.0.0/2' and the second half '1.0.1/2'.  If you
know that an episode is from the first season, but you don't know
which episode it is or whether it is part of a multiparter, you could
give the episode-num as '0..'.  Here the second and third numbers have
been omitted.  If you know that this is the first part of a three-part
episode, which is the last episode of the first series of thirteen,
its number would be '0 . 12/13 . 0/3'.  The series number is just '0'
because you don't know how many series there are in total - perhaps
the show is still being made! */

describe('xmltv', () => {
  describe('getSeasonNumber', () => {
    it('should find a 1-digit season number from the given string', (done) => {
      const strings = [
        '1 . 3 .',
        '1.0.0/1',
        '1.0.0/2',
        '1.0.1/2',
        '1..',
        '1 . 12/13 . 0/3',
      ];
      strings.forEach((string) => {
        getSeasonNumber(string).should.equal(2);
      });
      done();
    });

    it('should find a 2-digit season number from the given string', (done) => {
      const strings = [
        '12 . 3 .',
        '12.0.0/1',
        '12.0.0/2',
        '12.0.1/2',
        '12..',
        '12 . 12/13 . 0/3',
      ];
      strings.forEach((string) => {
        getSeasonNumber(string).should.equal(13);
      });
      done();
    });
  });

  describe('getEpisodeNumber', () => {
    it('should find a 1 digit episode number from the given string', (done) => {
      const strings = [
        '1 . 3 .',
        '1.3.0/1',
        '1.3.0/2',
        '1.3.1/2',
        '.3.',
        '1 . 3/13 . 0/3',
      ];
      strings.forEach((string) => {
        getEpisodeNumber(string).should.equal(4);
      });
      done();
    });

    it('should find a  2-digit episode number from the given string', (done) => {
      const strings = [
        '1 . 21 .',
        '1.21.0/1',
        '1.21.0/2',
        '1.21.1/2',
        '.21.',
        '1 . 21/22 . 0/3',
      ];
      strings.forEach((string) => {
        getEpisodeNumber(string).should.equal(22);
      });
      done();
    });
  });
});
