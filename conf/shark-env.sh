export SHARK_MASTER_MEM=1g
SPARK_JAVA_OPTS+=-Dspark.kryoserializer.buffer.mb=10 
export SPARK_JAVA_OPTS
export HIVE_HOME=/home/kv/hive-0.11.0-bin
export HADOOP_HOME=/home/kv/hadoop-2.0.0-cdh4.6.0
export HIVE_CONF_DIR=home/kv/hive-0.11.0-bin/conf
export SCALA_HOME=/home/kv/scala-2.10.3

export MASTER="spark://localhost:7077"
export SPARK_HOME=/home/kv/spark

source $SPARK_HOME/conf/spark-env.sh
