#!/bin/bash
#
#/**
# * Copyright 2007 The Apache Software Foundation
# *
# * Licensed to the Apache Software Foundation (ASF) under one
# * or more contributor license agreements.  See the NOTICE file
# * distributed with this work for additional information
# * regarding copyright ownership.  The ASF licenses this file
# * to you under the Apache License, Version 2.0 (the
# * "License"); you may not use this file except in compliance
# * with the License.  You may obtain a copy of the License at
# *
# *     http://www.apache.org/licenses/LICENSE-2.0
# *
# * Unless required by applicable law or agreed to in writing, software
# * distributed under the License is distributed on an "AS IS" BASIS,
# * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# * See the License for the specific language governing permissions and
# * limitations under the License.
# */
#
# Runs Zeppelin daemon
#
#

usage="Usage: zeppelin-daemon.sh [--config <conf-dir>]\
 (start|stop|restart|status) \
 <args...>"

# if no args specified, show usage
if [ $# -le 0 ]; then
  echo $usage
  exit 1
fi

bin=`dirname "${BASH_SOURCE-$0}"`
bin=`cd "$bin">/dev/null; pwd`

. $bin/common.sh


# get arguments
startStop=$1
shift
args=$1
shift



HOSTNAME=`hostname`
ZEPPELIN_LOGFILE=$ZEPPELIN_LOG_DIR/zeppelin-$ZEPPELIN_IDENT_STRING-$HOSTNAME.log
log=$ZEPPELIN_LOG_DIR/zeppelin-$ZEPPELIN_IDENT_STRING-$HOSTNAME.out
pid=$ZEPPELIN_PID_DIR/zeppelin-$ZEPPELIN_IDENT_STRING-$HOSTNAME.pid


if [ "${ZEPPELIN_NICENESS}" = "" ]; then
    export ZEPPELIN_NICENESS=0
fi

ZEPPELIN_MAIN=com.nflabs.zeppelin.server.ZeppelinServer

JAVA_OPTS+=" -Dzeppelin.log.file=$ZEPPELIN_LOGFILE"

function init(){
    if [ ! -d "$ZEPPELIN_LOG_DIR" ]; then
	echo "Log dir doesn't exist, create $ZEPPELIN_LOG_DIR"
	mkdir -p "$ZEPPELIN_LOG_DIR"
    fi

    if [ ! -d "$ZEPPELIN_PID_DIR" ]; then
	echo "Pid dir doesn't exist, create $ZEPPELIN_PID_DIR"
	mkdir -p "$ZEPPELIN_PID_DIR"
    fi

    if [ ! -d "$ZEPPELIN_JOB_DIR" ]; then
	echo "Job dir doesn't exist, create $ZEPPELIN_JOB_DIR"
	mkdir -p "$ZEPPELIN_JOB_DIR"
    fi
}

function start(){
    if [ -f "$pid" ]; then
	if kill -0 `cat $pid` > /dev/null 2>&1; then
	    echo zeppelin running as process `cat $pid`. Stop it first.
	    exit 1
	fi
    fi
    
    init

    echo "Start Zeppelin"
    nohup nice -n $ZEPPELIN_NICENESS $ZEPPELIN_RUNNER $JAVA_OPTS -cp $CLASSPATH $ZEPPELIN_MAIN "$@" >> "$log" 2>&1 < /dev/null &
    newpid=$!
    echo $newpid > $pid
    sleep 2
    # Check if the process has died; in that case we'll tail the log so the user can see
    if ! kill -0 $newpid >/dev/null 2>&1; then
	echo "failed to launch Zeppelin:"
	if [ "${CI}" == "true" ]; then
	    tail -1000 "$log" | sed 's/^/  /'
	else
	    tail -5 "$log" | sed 's/^/  /'
	fi
	echo "full log in $log"
    fi

    if [ "${CI}" == "true" ]; then  # if it is CI wait until server is up and running and ready to serve.
	COUNT=0
	while [ $COUNT -lt 30 ]; do
	    curl -v localhost:8080 2>&1 | grep '200 OK'
	    if [ $? -ne 0 ]; then
		sleep 1
		continue
	    else
		break
	    fi
	    let "COUNT+=1"
	done
    fi

}

function stop(){
    if [ -f $pid ]; then
	if kill -0 `cat $pid` > /dev/null 2>&1; then
	    echo Shutdown Zeppelin

	    COUNT=0
	    while [ $COUNT -lt 5 ]; do
		kill `cat $pid` > /dev/null 2> /dev/null
		if kill -0 `cat $pid` > /dev/null 2>&1; then
		    sleep 3
		    let "COUNT+=1"
		else
		    break
		fi
	    done
	    if kill -0 `cat $pid` > /dev/null 2>&1; then
		echo "failed to stop Zeppelin:"
		tail -2 "$log" | sed 's/^/  /'
		echo "full log in $log"
	    fi

	else
	    echo no Zeppelin to stop
	fi
    else
	echo no Zeppelin to stop
    fi

}

function status(){
    if [ -f "${pid}" ] && kill -0 `cat $pid` > /dev/null 2>&1; then
	echo "Zeppelin is running `cat $pid`"
	exit 0
    else
	echo "Zeppelin is not running"
	exit 1
    fi
}


case $startStop in
    (start)
	start
	;;
    (stop)
	stop
	;;
    (restart)
	stop
	start
	;;
    (status)
	status
	;;
    (*)
	echo $usage
	exit 1
	;;
esac
