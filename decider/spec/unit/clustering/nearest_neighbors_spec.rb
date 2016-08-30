# encoding: UTF-8
require File.dirname(__FILE__) + "/../../spec_helper"

describe Clustering::NearestNeighbors do
  
  before do
    @nearest_nodes = Clustering::NearestNeighbors.new(:binary) { |doc| doc.plain_text }
  end
  
  it "should create a BK-Tree" do
    @nearest_nodes.tree.should be_an_instance_of(Clustering::BkTree)
  end
  
  it "should populate the BK-Tree with documents from the corpus" do
    @nearest_nodes << "some text" << "even more text" << "some more text" << "yet more" << "some drivel text"
    @nearest_nodes.tree.size.should == 5
  end
  
  context "finding neighbor documents" do
    
    before do
      @nearest_nodes << "some text" << "even more text" << "some more text" << "yet more" << "some drivel text"
    end
  
    it "should find documents within a given radius of a target" do
      @nearest_nodes.in_range(1, "some nonsense text").should have(3).results
    end
    
    it "should find the single nearest neighbor" do
      @nearest_nodes.nearest("some drivel text").raw.should == "some drivel text"
    end
  
    it "should find the K nearest neighbors" do
      results = @nearest_nodes.k_nearest_neighbors(2, "more text")
      results.should have(2).documents
      results.each do |result|
        result.raw.should match(/more text/)
      end
    end
    
    it "should respond to knn as an alias for k_nearest_neighbors" do
      @nearest_nodes.should respond_to(:knn)
    end
    
    it "should allow a distance limit to be specified for a KNN search" do
      @nearest_nodes.tree.should_receive(:knn).with(5, anything(), {:distance => 10})
      @nearest_nodes.knn(5, "whatever", :distance => 10)
    end
    
    it "should have an un-optimized knn search for distance calculations that don't form a metric space" do
      p results = @nearest_nodes.slow_knn(3, "some nonsense text")
      results.should have(3).documents
      # results.should include("the expected results")
      pending
    end
    
  end
  
end
