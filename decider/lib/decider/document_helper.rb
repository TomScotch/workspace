# encoding: UTF-8

module Decider
  module DocumentHelper
    
    def new_document(name, string)
      doc = Document.new(name, string)
      document_callback.call(doc)
      doc
    end
    
    def document_callback
      @document_callback || TokenTransforms.default_transform
    end
    
    def self.included(receiver)
      receiver.send :attr_writer, :document_callback
    end
    
  end
end
