package com.nflabs.zeppelin.scheduler;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class SchedulerFactory implements SchedulerListener{
	private final Logger logger = LoggerFactory.getLogger(SchedulerFactory.class);
	ScheduledExecutorService executor;
	Map<String, Scheduler> schedulers = new LinkedHashMap<String, Scheduler>();
	
	public SchedulerFactory() throws Exception {
		executor = Executors.newScheduledThreadPool(5);		
	}
	
	public void destroy() {
		executor.shutdown();
	}

	public Scheduler createOrGetFIFOScheduler(String name) {
		synchronized(schedulers){
			if(schedulers.containsKey(name)==false){
				Scheduler s = new FIFOScheduler(name, executor, this);
				schedulers.put(name, s);
				executor.execute(s);
			}
			return schedulers.get(name);
		}
	}
	
	public Scheduler createOrGetParallelScheduler(String name, int maxConcurrency) {
		synchronized(schedulers){
			if(schedulers.containsKey(name)==false){
				Scheduler s = new ParallelScheduler(name, executor, this, maxConcurrency);
				schedulers.put(name, s);
				executor.execute(s);
			}
			return schedulers.get(name);
		}
	}

	public Scheduler removeScheduler(String name) {
		synchronized(schedulers){
			Scheduler s = schedulers.remove(name);
			if(s!=null){
				s.stop();
			}
		}
		return null;
	}

	public Collection<Scheduler> listScheduler(String name) {
		List<Scheduler> s = new LinkedList<Scheduler>();
		synchronized(schedulers){
			for(Scheduler ss :schedulers.values()){
				s.add(ss);
			}
		}
		return s;
	}

	public void jobStarted(Scheduler scheduler, Job job) {
		logger.info("Job "+job.getJobName()+" started by scheduler "+scheduler.getName());
		
	}

	public void jobFinished(Scheduler scheduler, Job job) {
		logger.info("Job "+job.getJobName()+" finished by scheduler "+scheduler.getName());
		
	}
	


}
