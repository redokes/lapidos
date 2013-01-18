Ext.define('Lapidos.audio.module.Server', {
    extend: 'Lapidos.module.Module',

    requires: [

    ],

    config: {
        name: 'audio-server',
        title: 'Audio Server',
        services: [

        ],
        directories: [],
        metaData: []
    },
    probe: probe,
    fs: require('fs'),

    onLaunch: function(config) {
        this.callParent(arguments);

        Ext.apply(this, config);
        console.log('audio server launched');

        this.walk(this.directories[0], function(err, files) {
            console.log(files.length);
            this.probeFiles(files);
        }.bind(this));
    },

    probeFiles: function(files) {
        console.log('Probing ' + files.length);
        var numRemaining = files.length;
        var inProgress = 0;
        var i = 0;
        this.probeInterval = setInterval(function() {
            if (inProgress >= 50) {
                return;
            }
            if (numRemaining == 0 || i >= files.length) {
                clearInterval(this.probeInterval);
                setTimeout(this.onProbeFinish.bind(this), 100);
                return;
            }
            inProgress++;
            this.probe(files[i++], function(err, probeData) {
                numRemaining--;
                inProgress--;
                this.metaData.push(probeData);

            }.bind(this));
        }.bind(this), 10);
    },

    walk: function(dir, done) {
        var results = [];
        this.fs.readdir(dir, function(err, list) {
            if (err) {
                return done(err);
            }
            var pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach(function(file) {
                file = dir + '/' + file;
                this.fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        this.walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    }
                    else {
                        if (file.match(/\.mp3$/)) {
                            results.push(file);
                        }
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },

    onProbeFinish: function() {
        console.log('Finished');
        console.log(this.metaData.length);
    }

});
