# encoding: UTF-8

module Decider
  class TrainingSet
    attr_reader :documents, :name
    include DocumentHelper
    
    # Creates a new training set. Generally, one training set object corresponds
    # to a single class of document, i.e., spam or ham.
    # Documents given for training (<<) or analysis
    # will be processed according to the given block. For example:
    # 
    #   ts = TrainingSet.new do |doc|
    #     doc.plain_text
    #     doc.stem
    #     doc.ngrams(3)
    #   end
    #
    # The methods called on doc are defined in TokenTransforms. Your own
    # tokenization methods can be created in a module and loaded with 
    # <tt>Document.custom_transforms(YourOwnTokenTransforms)</tt>
    #
    def initialize(name, owner, &block)
      @name, @owner = name.to_s, owner
      @tokens, @documents = Hash.new {0}, []
      if block_given?
        self.document_callback = block
      end
    end
    
    def tokenize(&block)
      self.document_callback= block
    end
    
    # Uses +document_string+ as a training document
    def <<(document_string)
      push(document_string[0..9].strip + "...", document_string)
    end
    
    def push(name, document_str)
      invalidate_cache
      @documents << new_document(name, document_str)
      self
    end
    
    def tokens
      @token_values ||= collected_tokens.keys.sort
    end
    
    def term_frequency
      unless @term_frequency
        @term_frequency = {}
        tokens.each { |token| @term_frequency[token] = count_of(token) }
      end
      @term_frequency
    end
    
    def count_of(token)
      collected_tokens[token]
    end
    
    def doc_count
      @documents.size
    end
    
    def save
      store[documents_key] = @documents
    end
    
    def load
      invalidate_cache
      @documents = store[documents_key]
    end
    
    private
    
    def collected_tokens
      unless @collected_tokens
        @collected_tokens = Hash.new {0}
        @documents.each do |doc|
          doc.tokens.each do |token|
            @collected_tokens[token] += 1
          end
        end
      end
      @collected_tokens
    end
    
    def store
      @owner.store
    end
    
    def documents_key
      "#{@owner.name}::#{@name}::documents"
    end
    
    def tokens_key
      "#{@owner.name}::#{@name}::tokens"
    end
    
    def hapax_occurrence_value
      0
    end
    
    def invalidate_cache
      @owner.invalidate_cache
      @token_values = nil
      @term_frequency = nil
      @collected_tokens = nil
    end
    
  end
  
end
