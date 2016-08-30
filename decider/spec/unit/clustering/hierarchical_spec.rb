# encoding: UTF-8
require File.dirname(__FILE__) + "/../../spec_helper"

describe Clustering::Hierarchical do
  
  before do
    @clusterer = Clustering::Hierarchical.new { |d| d.plain_text }
  end
  
  it "should create a node tree from the documents in the training set" do
    @clusterer << "some text" << "even more text" << "some more text" << "yet more"
    #puts @clusterer.tree.to_formatted_s
    @clusterer.tree.should be_an_instance_of Clustering::Tree
    @clusterer.root_node.should be_an_instance_of Clustering::Node
    @clusterer.root_node.should have(2).children
    @clusterer.root_node.children.each { |c| c.should have(2).children }
  end
  
  it "should name the nodes in the tree with document names" do
    @clusterer.push(:a_named_doc, "should mean a named node")
    @clusterer.root_node.children.first.name.should == "a_named_doc"
  end
  
end
