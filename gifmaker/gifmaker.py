#!/usr/bin/perl

# ************************************************************
# * gifmaker - A tool for making animated GIFs from video
#              files.   This works as a wrapper around
#              FFmpeg and ImageMagick's convert.
#
#              For more details see:
# http://www.leshylabs.com/blog/dev/2013-08-04-Making_Animated_GIFs_from_the_Linux_Command_Line.html
# ************************************************************

#
# Copyright (c) 2013, Leshy Labs LLC
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#     * Redistributions of source code must retain the above copyright
#       notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above
#       copyright notice, this list of conditions and the following
#       disclaimer in the documentation and/or other materials provided
#       with the distribution.
#     * The names names of the authors may not be used to endorse or
#       promote products derived from this software without specific
#       prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND ITS
# CONTRIBUTERS ''AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
# INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR ITS
# CONTRIBUTERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
# USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
# OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
# SUCH DAMAGE.
#

# Changes
#  8/9/13 - Added some default optimizations to convert

use strict;
use File::Temp qw/ tempdir /;

my $CONFIG = {
    ffmpeg => 'ffmpeg',       # ffmpeg binary
    convert => 'convert',     # ImageMagick convert binary
    output_file => 'out.gif', # Default file to write to
    default_fps => 10,        # Default frames per second
    ffmpeg_args => '',        # Extra arguments for ffmpeg
    convert_args => '-layers removeDups -layers Optimize' # Extra arguments for convert
};

sub usage {
    die "USAGE: $0 [input_file] [output_file] [frames_per_second]\n" .
	"    input_file - The input video file to convert (Required)\n" .
	"    output_file - The GIF file to be created (Default=$CONFIG->{output_file})\n" .
	"    frames_per_second - The GIF's frame rate. (Default=$CONFIG->{default_fps})\n\n" .
	"ENVIRONMENT:\n" .
	"    FFMPEG_ARGS - Extra arguments for ffmpeg\n" .
	"    CONVERT_ARGS - Extra arguments for ImageMagick's convert command\n";
}

sub verify {
    # Verify all parameters and settings before proceeding
    my ($input_file, $output_file, $fps) = @_;

    if (! -e $input_file) {
	die "ERROR: Input file '$input_file' does not exist.\n";
    }
    elsif ($fps !~ /^\d{1,2}$/ || $fps == 0) {
	die "ERROR: FPS value '$fps' is not valid.  A number from 1 to 99 must be provided\n";
    }
    elsif ($output_file !~ /\.gif$/i) {
	die "ERROR: Output file must use the '.gif' extension\n";
    }
    elsif (-e $output_file) {
	die "ERROR: Output file '$output_file' already exists\n";
    }
}

sub run_command {
    my ($command) = @_;

    print "*** $command\n";
    system($command);
    print "\n";

    if ($? >> 8 != 0) {
	die "ERROR: Command did not return a 0 exit status.  Aborting.\n";
    }
}

sub make_gif {
    my ($input_file, $output_file, $fps) = @_;
    my $temp_dir = tempdir(CLEANUP => 1);
    my $real_output_file = $output_file;
    my $delay = sprintf("%.0f", (100 / $fps)); # Delay value for convert in hundreths of second and rounded

     # Protect some special characters
    $output_file =~ s/([;\$\\`])/\\\1/g;

    run_command("$CONFIG->{ffmpeg} $CONFIG->{ffmpeg_args}  $ENV{FFMPEG_ARGS} " .
		"-i $input_file -r $fps $temp_dir/frame.\%05d.gif");
    run_command("$CONFIG->{convert} $CONFIG->{convert_args} -loop 0 $ENV{CONVERT_ARGS} " .
		"-delay $delay $temp_dir/frame.*.gif $output_file");

    print "Animated gif saved to '$real_output_file'\n";
}

sub main {
    my ($input_file, $output_file, $fps) = @ARGV;

    if ($#ARGV < 0 || $#ARGV > 2) {
	usage();
    }

    # If the arguments are not provided, set the default values
    $fps         ||= $CONFIG->{default_fps};
    $output_file ||= $CONFIG->{output_file};

    verify($input_file, $output_file, $fps);   # Verify all parameters
    make_gif($input_file, $output_file, $fps); # Create the animated GIF
}

main();
